import csv
import json
import os

def clean_and_convert_csv_to_json():
    """
    Read therapists_upload.csv and convert to therapists.json
    """
    csv_file = 'therapists_upload.csv'
    json_file = '../frontend/data/therapists.json'
    
    if not os.path.exists(csv_file):
        print(f"Error: {csv_file} not found")
        return
    
    therapists = []
    
    try:
        with open(csv_file, 'r', encoding='utf-8') as file:
            csv_reader = csv.DictReader(file)
            
            for idx, row in enumerate(csv_reader, 1):
                # Clean and validate data
                therapist = {
                    "id": idx,
                    "name": row.get('name', '').strip(),
                    "specialization": row.get('specialization', '').strip(),
                    "fee": int(row.get('fee', 0)) if row.get('fee', '').isdigit() else 0,
                    "ratings": float(row.get('ratings', 0)) if row.get('ratings', '') else 0.0,
                    "languages": row.get('languages', '').strip(),
                    "city": row.get('city', '').strip(),
                    "pincode": row.get('pincode', '').strip(),
                    "disorder": row.get('disorder', '').strip(),
                    "whatsapp": row.get('whatsapp', '').strip()
                }
                
                # Validate required fields
                if therapist['name'] and therapist['specialization']:
                    therapists.append(therapist)
                else:
                    print(f"Warning: Skipping row {idx} due to missing required fields")
        
        # Write to JSON file
        with open(json_file, 'w', encoding='utf-8') as file:
            json.dump(therapists, file, indent=2, ensure_ascii=False)
        
        print(f"Successfully converted {len(therapists)} therapist records to {json_file}")
        
    except Exception as e:
        print(f"Error processing CSV file: {e}")

def validate_therapist_data():
    """
    Validate the therapist data in the JSON file
    """
    json_file = '../frontend/data/therapists.json'
    
    try:
        with open(json_file, 'r', encoding='utf-8') as file:
            therapists = json.load(file)
        
        print(f"Validation: Found {len(therapists)} therapist records")
        
        for therapist in therapists:
            required_fields = ['name', 'specialization', 'city']
            missing_fields = [field for field in required_fields if not therapist.get(field)]
            
            if missing_fields:
                print(f"Warning: Therapist {therapist.get('name', 'Unknown')} missing: {missing_fields}")
        
        print("Validation complete")
        
    except Exception as e:
        print(f"Error validating data: {e}")

if __name__ == '__main__':
    print("Starting data cleaning process...")
    clean_and_convert_csv_to_json()
    validate_therapist_data()
    print("Data cleaning process completed.")

