# MEN Stack Project

This project is a small clone of Airbnb built using the MEN stack (MongoDB, Express.js, and Node.js) with additional technologies for enhanced functionality and responsive design.

## Features

- **Listings**: Add and manage listings such as villas, hotels, and homes.
- **Reviews**: Users can add reviews to listings.
- **Authentication**: Secure user authentication using the Passport library.
- **Responsive Design**: Utilizes Bootstrap for a mobile-friendly, responsive design.
- **Alerts**: Uses connect-flash for displaying alert messages.
- **Image Uploads**: Integrates Cloudinary for image hosting and uploads.
- **Maps**: Displays actual coordinates of locations using Mapbox.
- **Cloud Database**: MongoDB Atlas for cloud-hosted database.
- **Cloud Hosting**: Render for hosting the project in the cloud.

## Technologies Used

- **Node.js**: Server-side JavaScript runtime.
- **Express.js**: Web application framework for Node.js.
- **EJS**: Embedded JavaScript templating for dynamic web pages.
- **MongoDB**: NoSQL database.
- **Bootstrap**: Front-end framework for responsive design.
- **connect-flash**: Middleware for flash messages.
- **Cloudinary**: Cloud service for image uploads.
- **Passport**: Authentication middleware for Node.js.
- **Mapbox**: Maps and location data platform.
- **MongoDB Atlas**: Cloud-hosted MongoDB service.
- **Render**: Cloud platform for hosting web applications.

## Getting Started

### Prerequisites

- Node.js installed on your machine.
- MongoDB Atlas account for the database.
- Cloudinary account for image uploads.
- Mapbox account for map services.
- Render account for hosting.

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/husainafser/MEN-Stack-Project.git
    cd MEN-Stack-Project
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and add the following environment variables:

    ```plaintext
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_KEY=your_cloudinary_key
    CLOUDINARY_SECRET=your_cloudinary_secret
    MAPBOX_TOKEN=your_mapbox_token
    DB_URL=your_mongo_db_atlas_url
    SECRET=your_session_secret
    ```

### Running the Application

Start the application:

```bash
node app.js
```

The application will be locally running at `http://localhost:8080/listings`.

## Usage

- **Add Listings**: Users can add new listings by providing details such as title, description, and location.
- **View Listings**: Users can browse all available listings.
- **Add Reviews**: Users can add reviews to listings they have visited.
- **Authentication**: Users need to create an account and log in to add listings and reviews.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Inspired by Airbnb.
- Thanks to the contributors of Node.js, Express.js, MongoDB, and all other libraries and services used in this project.
