# AIO Fitness

AIO Fitness (All-in-One Fitness) is a web application designed to help users track their fitness journey. It combines workout tracking, calorie and water intake monitoring, and social features for sharing workouts and progress. This project is built using Next.js and TypeScript and is connected to a database for persistent data storage.

## Testing
For testing without needing to register your email, use this account:
    ```
    username: admin
    password: password
    ```

## Features

- **Navigation Bar**: Access various sections of the app, including:
  - Home
  - Nutrition
  - Workout
  - Social
  - Profile
- **Calorie Tracking**: Monitor your daily calorie intake with progress indicators.
- **Workout Tracking**: Log your workouts and set fitness goals.
- **Social Sharing**: Connect with other users, share your workouts, and celebrate progress together.
- **Responsive Design**: Optimized for both desktop and mobile platforms.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) with TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [PostgreSQL](https://vercel.com/docs/storage/vercel-postgres)
- **Version Control**: [GitHub](https://github.com/aj-et/aiofitness)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/aj-et/aiofitness.git
   ```

2. Navigate to the project directory:
   ```bash
   cd aiofitness
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env.local` file and configure your environment variables for database connection and API keys.

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open http://localhost:3000 in your browser to view the application.

## Folder Structure

```
aiofitness/
├── public/        # Static assets
├── app/           # Web page routes
├── components/    # Reusable UI components
├── prisma/        # Database schema and migrations
├── types/         # Types for typescript
├── package.json   # Project metadata and dependencies
```

## Contributing

Contributions are welcome! To get started:

1. Fork the repository.

2. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature-name
   ```

3. Commit your changes:
   ```bash
   git commit -m "Add feature-name"
   ```

4. Push to your forked repository:
   ```bash
   git push origin feature-name
   ```

5. Submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contact

For inquiries or feedback, contact Aaron Tumbokon:
* **Email**: tum19001@byui.edu
* **LinkedIn**: linkedin.com/in/tumbokonaaron
* **Website**: www.codeaaron.dev