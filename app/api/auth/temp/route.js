import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import mongoose from "mongoose";    

export async function GET(req) {
  try {
    await dbConnect();
    const users = await User.find({});
    return Response.json(
      { message: "Users fetched successfully", users },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { message: "Error fetching users", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await dbConnect();

    // Create at least 10 dummy users
    const dummyUsers = [
      { name: "John Doe", email: "johnsir@example.com", password: "pass123" },
      { name: "Alice Smith", email: "alice@example.com", password: "pass123" },
      { name: "Bob Johnson", email: "bob@example.com", password: "pass123" },
      { name: "Charlie Brown", email: "charlie@example.com", password: "pass123" },
      { name: "Diana Miller", email: "diana@example.com", password: "pass123" },
      { name: "Ethan Davis", email: "ethan@example.com", password: "pass123" },
      { name: "Fiona Walker", email: "fiona@example.com", password: "pass123" },
      { name: "George Wilson", email: "george@example.com", password: "pass123" },
      { name: "Hannah Clark", email: "hannah@example.com", password: "pass123" },
      { name: "Ian Thompson", email: "ian@example.com", password: "pass123" },
    ];

    const createdUsers = await User.insertMany(dummyUsers);

    return Response.json(
      {
        message: "10 users added successfully",
        users: createdUsers,
      },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      { message: "Error adding users", error: error.message },
      { status: 500 }
    );
  }
}



export async function DELETE() {
  try {
    await dbConnect();

    // Create a temporary dynamic model for the existing collection
    const Person =
      mongoose.models.Person ||
      mongoose.model(
        "Person",
        new mongoose.Schema({}, { strict: false }),
        "Person" // <-- name of collection in Atlas
      );

    const result = await Person.deleteMany({});

    return Response.json(
      {
        message: "All documents deleted successfully",
        deletedCount: result.deletedCount,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { message: "Error deleting documents", error: error.message },
      { status: 500 }
    );
  }
}
