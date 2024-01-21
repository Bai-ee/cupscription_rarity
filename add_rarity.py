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

    # Create a dictionary to map each item_index to its next item's rarity score
    rarity_map = {item['item_index']: source_items[i + 1]['Rarity'] if i + 1 < len(source_items) else "Unknown"
                  for i, item in enumerate(source_items[:-1])}

    # Update target items with rarity scores from the next item in the source
    for item in target_items:
        item_index = item.get('item_index')
        item['Rarity'] = rarity_map.get(item_index, "Unknown")

    write_json(target_data, target_file)

# Example usage
merge_collections('cupscriptions-collection_total_items.json', 'cupscriptions-collection.json')
