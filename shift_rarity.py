import json

def read_json(filename):
    with open(filename, 'r', encoding='utf-8') as file:
        return json.load(file)

def write_json(data, filename):
    with open(filename, 'w', encoding='utf-8') as file:
        json.dump(data, file, indent=4, ensure_ascii=False)

def sort_items_by_rarity(collection_file):
    data = read_json(collection_file)
    collection_items = data.get('collection_items', [])

    # Assuming rarity scores are numeric. If not, modify the key function accordingly.
    collection_items.sort(key=lambda x: float(x.get('Rarity', float('inf'))), reverse=True)

    data['collection_items'] = collection_items
    write_json(data, collection_file)

# Example usage
sort_items_by_rarity('cupscriptions-collection.json')
