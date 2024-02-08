from PIL import Image
import os

def resize_to_exact_size(input_dir, output_dir, exact_size=(150, 150)):
    """
    Resize images to an exact size of 150x150 pixels, potentially distorting them, and save them to the output directory.

    :param input_dir: Directory containing the original images.
    :param output_dir: Directory where resized images will be saved.
    :param exact_size: Tuple specifying the exact size of the images.
    """
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    for filename in os.listdir(input_dir):
        if filename.lower().endswith((".jpg", ".jpeg")):
            img_path = os.path.join(input_dir, filename)
            img = Image.open(img_path)
            
            img_resized = img.resize(exact_size, Image.Resampling.LANCZOS)
            
            output_file_path = os.path.join(output_dir, filename)
            img_resized.save(output_file_path)
            print(f"Resized and saved image {filename}")

# Example usage
input_directory = "./images"
output_directory = "./thumbs"
resize_to_exact_size(input_directory, output_directory)


