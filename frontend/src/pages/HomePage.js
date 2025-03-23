import React from "react";
import "../css/HomePage.css"; // Assuming you'll add a CSS file for styling

const HomePage = () => {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Your Wellness Companion in Times of Need</h1>
          <h3>What is SafeMind?</h3>
          <p>
            SafeMind is not just a website; it’s your personal wellness companion—a
            friend you can rely on when life feels overwhelming. We understand that
            mental health challenges can feel isolating, and we’re here to ensure you
            never face them alone. With thoughtful tools, curated resources, and
            empathetic features, SafeMind empowers you to navigate your emotions and
            rediscover balance. Whether it’s sharing how you feel, understanding your
            mental health through our tests, or accessing personalized guidance,
            SafeMind is always here to help.
          </p>
        </div>
      </section>

      {/* Informative Section */}
      <section className="informative-section">
        <div className="info-content">
          <h2>The Power of Mental Well-being</h2>
          <p>
            Mental health is the foundation of a happy and fulfilling life. Just as
            physical health requires attention and care, so does your mental
            well-being. It shapes how you think, feel, and interact with the world
            around you. At SafeMind, we believe that nurturing your mind is as
            essential as taking care of your body. By prioritizing mental health,
            you’re not only improving your quality of life but also building
            resilience, fostering better relationships, and unlocking your true
            potential. Let SafeMind be your partner in this journey toward a
            healthier, happier you.
          </p>
        </div>
        <div className="info-image">
          {/* <img src="images/wellbeing" alt="Mental Well-being" /> */}
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="cta-section">
        <h2>Take the First Step Today</h2>
        <p>
          Your well-being journey starts here. Sign up to explore personalized tools,
          take insightful tests, and discover curated resources tailored just for
          you. Let SafeMind guide you toward a brighter tomorrow.
        </p>
        <div className="cta-buttons">
          <button className="primary-btn">Sign Up</button>
          <button className="secondary-btn">Learn More</button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
