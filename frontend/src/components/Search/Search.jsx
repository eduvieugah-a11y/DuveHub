import "./Search.css";

function Search() {
  return (
    <section className="search">
      <div className="search-box">

        <input
          type="text"
          placeholder="Search events, concerts, workshops..."
        />

        <select>
          <option>Location</option>
          <option>Lagos</option>
          <option>Abuja</option>
          <option>Port Harcourt</option>
        </select>

        <input type="date" />

        <button>Search Events</button>

      </div>
    </section>
  );
}

export default Search;