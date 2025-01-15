import SearchBar from "../../components/searchBar/SearchBar"
import SearchXLogo from "../../components/searchXLogo/SearchXLogo"
import './Home.scss'

const Home = () => {
    return <div className="home-page"><SearchXLogo/><SearchBar/></div>
}

export default Home