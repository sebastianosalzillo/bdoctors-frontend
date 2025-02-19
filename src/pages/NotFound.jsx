import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <>
            <div className="error-img">
                <div className="flex justify-center items-center text-center p-4 vh-100">
                    <div className="flex items-center justify-center flex-col">
                        <div>
                            {/* <h1 className="text-6xl md:text-8xl font-semibold text-slate-950">404</h1> */}
                            <img src="error404.jpeg" alt="" className="w-50 rounded-circle "/>
                            <p className="text-xl md:text-4xl font-semibold text-slate-950 mt-3">Oops! Qualcosa è andato storto.</p>
                        </div>
                        <p className="text-sm md:text-xl text-slate-600"> Hai bussato alla porta giusta, ma nessuno sa dove sia quello che cerchi.</p>
                    </div>
                    <Link to={"/"} className="btn btn-primary">Torna alla home</Link>
                </div>
            </div>
        </>
    )
}

export default NotFound;