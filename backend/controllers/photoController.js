import Trip from "../models/Trip.js";

/*
  @desc    Add photo to a trip
  @route   POST /api/trips/:id/photos
  @access  Private
*/
export const addPhotoToTrip = async (req, res) => {
  const { photoUrl } = req.body;

  if (!photoUrl) {
    return res.status(400).json({ message: "Photo URL required" });
  }

  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user,
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // push photo
    trip.photos.push(photoUrl);
    await trip.save();

    res.json(trip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add photo" });
  }
};
