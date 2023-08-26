
const Home = () => {

    const handleSubmit = (e) => {
        e.preventDefault();
        let name = e.target.name.value;
        name = btoa(name);
        window.location.href = `/chat/${name}`;
    }

    return (
        <div>


            <form onSubmit={handleSubmit} >
                <input type="text" name="name" id="name" />
                
                <button type="submit">Join</button>
            </form>
        </div>
    );
};

export default Home;