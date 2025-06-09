import Event from "../models/Event.js";
import { v2 as cloudinary } from "cloudinary";

export const createEvent = async (req, res) => {
    try {
        const {eventName,description,eventDate,location,price,capacity} = req.body;

        // upload images to cloudinary
        const uploadImages = req.files.map(async (file) => {
            const response = await cloudinary.uploader.upload(file.path);
            return response.secure_url;
        });

        // Wait for all uploads to complete
        const images = await Promise.all(uploadImages);
        
        const event = await Event.create({
            eventName,
            description,
            eventDate,
            location,
            price,
            capacity,
            images,
        });

        res.json({ success: true, message: "Event created successfully",event });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const getEvents = async (req, res) => {
    try {
        const events = await Event.find({});
        res.json({ success: true, events });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const getEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id);
        res.json({ success: true, event });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        await Event.findByIdAndDelete(id);
        res.json({ success: true, message: "Event deleted successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { eventName, description, eventDate, location, price, capacity } = req.body;
        const event = await Event.findById(id);
        if(!event){
            return res.json({ success: false, message: "Event not found" });
        }

        if(eventName)event.eventName = eventName;
        if(description)event.description = description;
        if(eventDate)event.eventDate = eventDate;
        if(location)event.location = location;
        if(price)event.price = price;
        if(capacity)event.capacity = capacity;
        await event.save();
        res.json({ success: true, message: "Event updated successfully", event });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}