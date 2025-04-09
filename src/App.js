import logo from './logo.svg';
import './App.css';
import useScrollAnimation from './useScrollAnimation';

function App() {
  useScrollAnimation('.animate-on-scroll', 'is-visible', {
    threshold: 0.9,
    triggerOnce: true
  });

  useScrollAnimation('.animate-fade-in', 'is-visible', {
    threshold: 0.2,
    triggerOnce: true
  });
  useScrollAnimation('.animate-slide-left', 'is-visible', {
    threshold: 0.5,
    triggerOnce: true
  });


  return (
    <div>
      <section>
        <h1 className="animate-on-scroll">Welcome Section 1</h1>
        <p className="animate-on-scroll">This paragraph uses the default slide-up animation.</p>
        <button className="animate-fade-in">Fade Me In!</button>
      </section>

      <section>
        <h1 className="animate-slide-left">About Section 2</h1>
        <p className="animate-on-scroll">This one slides up.</p>
        <p className="animate-slide-left">And this one slides from the left.</p>
      </section>

      <section>
        <h1 className="animate-on-scroll">Features Section 3</h1>
        <p className="animate-fade-in">Just a simple fade here.</p>
        <p className="animate-on-scroll">Another slide-up paragraph for consistency.</p>
      </section>

      <section>
        <h1 className="animate-slide-left">Contact Section 4</h1>
        <p className="animate-on-scroll">Last slide-up.</p>
        <div className="animate-fade-in" style={{ marginTop: '20px', padding: '15px', background: '#eee' }}>
          A faded-in div.
        </div>
      </section>
    </div>
  );
}

export default App;
