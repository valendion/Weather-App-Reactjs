import { useState } from 'react';
import { useFetch } from 'use-http';
import EmptyData from './component/EmptyData';
import ErrorData from './component/ErrorData';
import Loading from './component/Loading';
import { titles } from './utils/constans';
import WeatherCard from './component/WeatherCard';

function App() {
  const [cardWeather, setWeather] = useState([]);
  const [error, setError] = useState('');
  const { get, loading, response } = useFetch(`http://api.weatherapi.com/v1`, {
    headers: {
      key: `${import.meta.env.VITE_KEY}`,
    },
  });

  const handleOnSubmit = async (event) => {
    event.preventDefault();
    setError('');
    const inputCity = event.target.inputCity;

    const weather = await get(`/current.json?q=${inputCity.value}`);

    if (response.ok) {
      const { location, current } = weather;

      const values = [{ value: location.name }, { value: location.region }, { value: location.country }, { value: current.condition.text }, { value: current.temp_c }, { value: current.humidity }];

      setWeather(
        titles.map((element, index) => {
          const mergeData = (element.value = values[index].value);

          return { title: element.title, value: mergeData };
        })
      );
    }

    if (!response.ok) {
      setError(weather.error.message);
    }
  };
  return (
    <div className="h-screen flex flex-col">
      <header>
        <nav>
          <div className="navbar bg-base-100 flex justify-center shadow-lg">
            <div className="normal-case text-xl">Weather App</div>
          </div>
        </nav>
      </header>
      <main className="grow">
        <div className="flex flex-col justify-center items-center my-4 h-full">
          <form onSubmit={handleOnSubmit}>
            <label htmlFor="label">
              <span className="label-text text-4xl">Search Your Location</span>
            </label>
            <div className="input-item flex justify-evenly items-center mt-8">
              <input type="text" name="inputCity" placeholder="Type your location" className="input input-bordered w-full max-w-screen-2xl mr-4" required />
              <input type="submit" className="btn" value="Submit" />
            </div>
          </form>

          <div className="mt-4 flex justify-center items-center">
            {(cardWeather.length === 0 && <EmptyData />) ||
              (loading && <Loading />) ||
              (error && <ErrorData message={error} />) ||
              (cardWeather && (
                <div className="grid grid-col-1 xl:grid-cols-3 gap-4 mt-10">
                  {cardWeather.map((element, index) => {
                    return <WeatherCard title={element.title} value={element.value} key={index} />;
                  })}
                </div>
              ))}
          </div>
        </div>
      </main>
      <footer className="footer items-center p-4 bg-neutral text-neutral-content">
        <aside className="items-center grid-flow-col">
          <svg width="36" height="36" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" className="fill-current">
            <path d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z"></path>
          </svg>
          <p>Copyright © 2023 Javascript Enthusias | Front End | Valendion Pradana Pasalu</p>
        </aside>
        <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
          Powered by{' '}
          <a href="https://www.weatherapi.com/" title="Free Weather API">
            WeatherAPI.com
          </a>
        </nav>
      </footer>
    </div>
  );
}

export default App;
