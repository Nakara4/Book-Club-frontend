import React from 'react';

const HeroSection = () => {
  return (
    <section className="py-20 bg-neutral-50 dark:bg-neutral-900">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-extrabold text-primary-900 dark:text-neutral-50 mb-4">
            Craft Exceptional Book Club Experiences
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-8">
            Connect with fellow readers to share your passion for books.
          </p>
          <button className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg">
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

