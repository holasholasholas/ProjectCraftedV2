// all URL here begin with /garage
const verifyToken = require('../middleware/verify-token');
const Car = require('../models/VehicleSchema');
const User = require('../models/userSchema');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// CREATE: add a new car
router.post("/", verifyToken, async (req, res) => {
  try {
    // Assign the logged in user as the owner of the car
    req.body.owner = req.user._id;
    
    // Create new car
    const newCar = await Car.create(req.body);
    
    // Add the car to the user's vehicle array
    await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { vehicle: newCar._id } }
    );
    
    // Return the new car with owner info
    newCar._doc.owner = req.user;
    res.status(201).json(newCar);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// INDEX: show all cars by user
router.get("/", verifyToken, async (req, res) => {
  try {
    // Find the user and populate their vehicles
    const user = await User.findById(req.user._id).populate({
      path: "vehicle", //reference vehicle collection
    });
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.status(200).json(user.vehicle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SHOW: show details for specific car
router.get("/:car_id", verifyToken, async (req, res) => {
  try {
    const car_id = req.params.car_id;
    
    // Find the car and populate owner details
    const car = await Car.findById(car_id).populate("owner");
    
    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }
    
    
    res.status(200).json(car);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE: update a car's information
router.put("/:car_id", verifyToken, async (req, res) => {
  try {
    const car_id = req.params.car_id;
    
    // Find the car first to verify ownership
    const car = await Car.findById(car_id);
    
    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }
    
    
    // Update the car
    const updatedCar = await Car.findByIdAndUpdate(
      car_id,
      req.body,
      { new: true }
    ).populate("owner");
    
    res.status(200).json(updatedCar);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: remove a car
router.delete("/:car_id", verifyToken, async (req, res) => {
  try {
    const car_id = req.params.car_id;
    
    // Find the car first to verify ownership
    const deleteCar = await Car.findByIdAndDelete(car_id);
    
    // Remove the car reference from the user's vehicle array
    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { vehicle: car_id } }
    );
    
    res.status(200).json({ message: "Car successfully deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;