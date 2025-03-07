from fastapi import APIRouter
from pydantic import BaseModel
from utils.preprocess import predict_status

router = APIRouter()

# Define request model
class MoodRequest(BaseModel):
    text: str

# Define response model
class MoodResponse(BaseModel):
    predicted_mood: str

@router.post("/predict-mood", response_model=MoodResponse)
async def predict_mood(request: MoodRequest):
    predicted_mood = predict_status(request.text)
    return {"predicted_mood": predicted_mood}
