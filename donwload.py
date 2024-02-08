import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse, urljoin
import sys

# Function to download a file from a URL
def download_file(url, folder_path):
    try:
        response = requests.get(url)
        if response.status_code == 200:
            file_name = os.path.join(folder_path, os.path.basename(urlparse(url).path))
            with open(file_name, 'wb') as file:
                file.write(response.content)
            print(f"Downloaded: {url} -> {file_name}")
            return True
        else:
            print(f"Failed to download: {url}")
            return False
    except Exception as e:
        print(f"Error: {e}")
        return False

# Function to extract and download .jpg files linked on a webpage
def download_jpg_links_from_website(url, folder_path, max_downloads=15):
    try:
        # Send an HTTP GET request to the URL
        response = requests.get(url)

        # Parse the HTML content of the page
        soup = BeautifulSoup(response.text, 'html.parser')

        # Find all hyperlinks in the HTML
        links = soup.find_all('a', href=True)

        # Create the folder if it doesn't exist
        os.makedirs(folder_path, exist_ok=True)

        # Download .jpg files
        num_downloads = 0
        for link in links:
            if num_downloads >= max_downloads:
                break

            link_url = link['href']
            if link_url.endswith('.jpg'):
                link_url = urljoin(url, link_url)
                if download_file(link_url, folder_path):
                    num_downloads += 1

        if num_downloads > 0:
            print(f"Downloaded {num_downloads} .jpg files from {url}")
        else:
            print(f"No .jpg files were downloaded from {url}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    # URL of the webpage to scrape .jpg links from
    website_url = "https://ipfs-gateway.ordex.io/ipfs/QmeQpiNwskecDZZABmbzQtC1TfvwZGmMPaWS7PdaXBjrWc/"

    # Folder path where you want to save the downloaded .jpg files
    folder_path = "downloaded_images"

    # Download a maximum of 15 .jpg files from the website
    download_jpg_links_from_website(website_url, folder_path, max_downloads=15)

    # Ask if you want to continue downloading more
    while True:
        continue_download = input("Do you want to continue downloading more .jpg files (yes/no)? ").strip().lower()
        if continue_download != "yes":
            break
        max_downloads = int(input("Enter the maximum number of downloads: "))
        download_jpg_links_from_website(website_url, folder_path, max_downloads=max_downloads)
