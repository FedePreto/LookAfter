from fastapi import FastAPI, File, UploadFile
from diffusers import StableDiffusionPipeline
from PIL import Image
import torch
import io

app = FastAPI()

# Load the model
model_id = "valhalla/sd-wikiart-v2"
device = "cuda" if torch.cuda.is_available() else "cpu"

pipe = StableDiffusionPipeline.from_pretrained(model_id)
pipe = pipe.to(device)

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # Load the image from the uploaded file
    image = Image.open(io.BytesIO(await file.read())).convert("RGB")
    
    # Make predictions (use a placeholder for "prompt" if needed)
    prompt = "A painting that matches this style"
    with torch.autocast(device):
        result = pipe(prompt, image=image)
    
    # Save or return the result
    result_image = result.images[0]
    output_path = "output.jpg"
    result_image.save(output_path)

    return {"message": "Prediction complete", "output": output_path}
