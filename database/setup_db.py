from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['plant_diseases']
collection = db['diseases']

# Disease data
diseases_data = [
    {
        "name": "blight",
        "description": "Blight is a fungal disease that causes brown lesions on leaves and stems, leading to tissue death. It thrives in wet conditions and can spread rapidly through crops.",
        "cure": "Remove and destroy infected plant parts. Apply copper-based fungicides. Improve air circulation between plants. Avoid overhead watering. Practice crop rotation to reduce disease recurrence."
    },
    {
        "name": "mosaic",
        "description": "Mosaic is a viral disease that causes mottled patterns of yellow and green on leaves. It affects plant growth and yield and is transmitted by insects like aphids.",
        "cure": "Remove infected plants immediately to prevent spread. Control insect vectors using appropriate insecticides. Use disease-resistant plant varieties. Maintain good garden hygiene to reduce contamination. Avoid working with plants when they are wet, as this can spread the virus."
    },
    {
        "name": "grasshopper",
        "description": "Grasshoppers are pests that cause irregular holes in leaves and stems. In large numbers, they can severely damage crops. They are most active during warm, dry weather.",
        "cure": "Use insecticidal sprays to control grasshoppers. Install physical barriers, such as fine mesh nets, to protect plants. Maintain natural predators like birds and beneficial insects. Apply neem oil solution as an organic repellent. Consider biological controls, such as Nosema locustae, to manage their population."
    },
    {
        "name": "healthy",
        "description": "A healthy plant shows normal growth patterns with no signs of disease or pest damage. The leaves are green and vibrant, and the plant develops properly.",
        "cure": "Water regularly to keep soil moisture balanced. Provide proper fertilization for optimal growth. Ensure adequate sunlight exposure. Maintain good air circulation around the plant. Monitor regularly to detect and prevent diseases early."
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