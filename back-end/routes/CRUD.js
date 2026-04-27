import express from 'express';
import { supabase } from "../config/supabase.js";

const router = express.Router();


// Get all articles

router.get("/articles", async (_, response) => {
  try {
    const { data, error } = await supabase.from("posts").select();
    console.log(data);
    return response.send(data);
  } catch (error) {
    return response.send({ error });
  }
});

// Get an article

router.get("/articles/:id", async (request, response) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select()
      .eq("id", request.params.id)
    console.log(data);
    return response.send(data);
  } catch (error) {
    return response.send({ error });
  }
});

// Post an article

router.post("/articles", async (request, response) => {
  try {
    console.log(request.body);
    const { data, error } = await supabase.from("posts").insert(request.body);
    if (error) {
      return response.status(400).json(error);
    }
    response.status(200).json(request.body);
  } catch (error) {
    response.send({ error });
  }
});

// Update an article

router.put("/articles/:id", async (request, response) => {
  console.log(request.params);
  try {
    const { data: updatedData, error: updatedError } = await supabase
      .from("posts")
      .update({
        title: request.body.title ? request.body.title : data[0].title,
        body: request.body.body ? request.body.body : data[0].body,
      })
      .eq("id", request.params.id);
    const { data, err } = await supabase.from("posts").select();
    return response.status(200).send(data);
  } catch (error) {
    response.send({ error });
  }
});
// Delete an article

router.delete("/articles/:id", async (request, response) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .delete()
      .eq("id", request.params.id);
    const { datar, errorr } = await supabase.from("posts").select();
    if (error) {
      return response.status(400).json(error);
    }
    return response.send(datar);
  } catch (error) {
    response.send({ error });
  }
});

export default router;