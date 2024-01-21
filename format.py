import json

def read_json(filename):
    with open(filename, 'r', encoding='utf-8') as file:
        return json.load(file)

def write_json(data, filename):
    with open(filename, 'w', encoding='utf-8') as file:
        json.dump(data, file, indent=4, ensure_ascii=False)

def merge_collections(source_file, target_file):
    source_data = read_json(source_file)
    target_data = read_json(target_file)

    source_items = source_data.get('collection_items', [])
    target_items = target_data.get('collection_items', [])

    # Creating a set of unique identifiers (e.g., ethscription_id) from the target items
    existing_ids = set(item['ethscription_id'] for item in target_items)

    # Merge items from source to target if not already present
    for item in source_items:
        if item['ethscription_id'] not in existing_ids:
            item['Rarity'] = " "  # Add Rarity field
            target_items.append(item)

    # Update the target data and write back to file
    target_data['collection_items'] = target_items
    write_json(target_data, target_file)

# Example usage
merge_collections('cupscriptions-collection_total_items.json', 'cupscriptions-collection.json')
