import os
import re
import nltk
import pickle
import numpy as np
from scipy.sparse import hstack
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer

nltk.download("punkt")

# Get the absolute path of the current script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "../model")

# Load saved vectorizer, label encoder, and model
try:
    with open(os.path.join(MODEL_DIR, "vectorizer.pkl"), "rb") as f:
        vectorizer = pickle.load(f)
    
    with open(os.path.join(MODEL_DIR, "label_encoder.pkl"), "rb") as f:
        lbl_enc = pickle.load(f)
    
    with open(os.path.join(MODEL_DIR, "model.pkl"), "rb") as f:
        model = pickle.load(f)
    
    print("✅ Model and preprocessing files loaded successfully!")
except FileNotFoundError as e:
    print(f"❌ Error: {e}\nMake sure all model files are in the correct directory: {MODEL_DIR}")
    raise

# Function to clean text
def remove_patterns(text):
    text = re.sub(r"http[s]?://\S+", "", text)  # Remove URLs
    text = re.sub(r"\[.*?\]\(.*?\)", "", text)  # Remove markdown links
    text = re.sub(r"@\w+", "", text)  # Remove handles
    text = re.sub(r"[^\w\s]", "", text)  # Remove special characters
    return text.strip()

def preprocess_input(text):
    text = text.lower()
    text = remove_patterns(text)
    tokens = word_tokenize(text)
    stemmed_text = " ".join(PorterStemmer().stem(token) for token in tokens)
    return stemmed_text

def prepare_features(text):
    processed_text = preprocess_input(text)
    processed_tfidf = vectorizer.transform([processed_text])
    num_characters = len(text)
    num_sentences = len(nltk.sent_tokenize(text))
    numerical_features = np.array([[num_characters, num_sentences]])
    input_combined = hstack([processed_tfidf, numerical_features])
    return input_combined

def predict_status(text):
    input_combined = prepare_features(text)
    prediction = model.predict(input_combined)
    predicted_status = lbl_enc.inverse_transform(prediction)
    return predicted_status[0]