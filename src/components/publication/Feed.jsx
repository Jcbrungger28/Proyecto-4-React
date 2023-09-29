import React, { useEffect, useState } from 'react'
// import avatar from '../../assets/img/user.png'
import { useParams } from 'react-router-dom';
import { Global } from '../../helpers/Global';
// import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import PublicationList from '../publication/PublicationList';


const Feed = () => {

    const { auth } = useAuth();
    const [publications, setPublications] = useState([]);
    const [page, setPage] = useState(1);
    const [more, setMore] = useState(true)
    const params = useParams();

    useEffect(() => {
        getPublication(1, false);
    }, []);

    const getPublication = async (nextPage = 1, showNews = false) => {

        if (showNews) {
            setPublications([]);
            setPage(1);
            nextPage = 1;
        }

        const request = await fetch(Global.url + 'publication/feed/' + nextPage, {
            method: 'GET',
            headers: {
                "Content-Type": 'application/json',
                "Authorization": localStorage.getItem('token')
            }
        });

        const data = await request.json();

        if (data.status == "success") {

            let newPublications = data.publications;

            if (!showNews && publications.length >= 1) {
                newPublications = [...publications, ...data.publications]
            }

            setPublications(newPublications)

            if (!showNews && publications.length >= (data.publications - data.publications.length)) {
                setMore(false)
            }

            if (data.pages <= 1) {
                setMore(false)
            }
        }
    }

    return (
        <>
            <header className="content__header">
                <h1 className="content__title">Timeline</h1>
                <button className="content__button" onClick={() => getPublication(1, true)}>Mostrar nuevas</button>
            </header>

            <PublicationList
                publications={publications}
                page={page}
                setPage={setPage}
                more={more}
                setMore={setMore}
                getPublication={getPublication}
            />

            <br />

        </>
    )
}

export default Feed
