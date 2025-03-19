from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['plant_diseases']
collection = db['diseases']

# Disease data
diseases_data = [
    {
        "name": "blight",
        "description": "A fungal disease that causes brown lesions on leaves and stems, leading to tissue death. Common in wet conditions and can spread rapidly through crops.",
        "cure": "1. Remove and destroy infected plant parts\n2. Apply copper-based fungicides\n3. Improve air circulation between plants\n4. Avoid overhead watering\n5. Practice crop rotation"
    },
    {
        "name": "mosaic",
        "description": "A viral disease causing mottled patterns of yellow and green on leaves. Affects plant growth and yield. Transmitted by insects like aphids.",
        "cure": "1. Remove infected plants immediately\n2. Control insect vectors using appropriate insecticides\n3. Use disease-resistant varieties\n4. Maintain good garden hygiene\n5. Avoid working with plants when wet"
    },
    {
        "name": "grasshopper",
        "description": "Pest infestation causing irregular holes in leaves and stems. Can severely damage crops in large numbers. Most active during warm, dry weather.",
        "cure": "1. Use insecticidal sprays\n2. Install physical barriers\n3. Maintain natural predators\n4. Apply neem oil solution\n5. Consider biological controls like Nosema locustae"
    },
    {
        "name": "healthy",
        "description": "Plant showing normal growth patterns with no signs of disease or pest damage. Leaves are green and vibrant with proper development.",
        "cure": "Maintain healthy conditions through:\n1. Regular watering\n2. Proper fertilization\n3. Adequate sunlight\n4. Good air circulation\n5. Regular monitoring for early disease detection"
    }
]

# Drop existing collection if it exists
collection.drop()

# Insert the data
collection.insert_many(diseases_data)

print("Database created and data inserted successfully!")

# Verify the data
for disease in collection.find():
    print(f"\nDisease: {disease['name']}")
    print(f"Description: {disease['description']}")
    print(f"Cure: {disease['cure']}")