import React from 'react'
import useAuth from '../../hooks/useAuth';
import { Global } from '../../helpers/Global';
import avatar from '../../assets/img/user.png';
import { Link } from 'react-router-dom';
// import React, { useEffect, useState } from 'react';
import ReactTimeAgo from 'react-time-ago';


const UserList = ({ users, getUsers, setFollowing, following, more, loading, page, setPage }) => {

    const { auth } = useAuth();

    const nextPage = () => {
        let next = page + 1;
        setPage(next);
        getUsers(next);
        console.log(page, next)

    }

    const follow = async (userId) => {
        //Peticion al bakend para guardar el follow
        const request = await fetch(Global.url + "follow/save", {
            method: "POST",
            body: JSON.stringify({ followed: userId }),
            headers: {
                "Content-Type": 'application/json',
                "Authorization": localStorage.getItem('token')
            }
        });

        const data = await request.json();

        //cuando este todo correcto
        if (data.status == "success") {
            //Actualizar estado de following, agregando el nuevo follow
            setFollowing([...following, userId])
        }

    }

    const unfollow = async (userId) => {
        //Peticion al bakend para borrar el follow
        const request = await fetch(Global.url + "follow/unfollow/" + userId, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem('token')
            }
        });
        const data = await request.json();

        //cuando este todo correcto
        if (data.status == 'success') {
            //Actualizar estado de following

            //filtrando los datos para eliminar el antiguo userId

            // que acabo de dejar de seguir 
            let filterFollowings = following.filter(followingUserId => userId !== followingUserId);
            setFollowing(filterFollowings)
        }

    }


    return (
        <>
            <div className="content__posts">

                {users.map(user => {
                    debugger
                    return (
                        <article className="posts__post" key={user._id}>

                            <div className="post__container">

                                <div className="post__image-user">
                                    <Link to={"/social/perfil/" + user._id} className="post__image-link">
                                        {user.image != "default.png" && <img src={Global.url + "user/avatar/" + user.image} className="post__user-image" alt="Foto de perfil" />}
                                        {user.image == "default.png" && <img src={avatar} className="post__user-image" alt="Foto de perfil" />}
                                    </Link>
                                </div>

                                <div className="post__body">

                                    <div className="post__user-info">
                                        <Link to={"/social/perfil/" + user._id} className="user-info__name">{user.name} {user.surname}</Link>
                                        <span className="user-info__divider"> | </span>
                                        <Link to={"/social/perfil/" + user._id} className="user-info__create-date"><ReactTimeAgo date={user.created_at} locale='es-ES' /></Link>
                                    </div>

                                    <h4 className="post__content">{user.bio}</h4>

                                </div>

                            </div>
                            {/* solo mostrar botones
                  cuando el usuario no es con el que estoy identificado  */}
                            {user._id != auth._id &&
                                <div className="post__buttons">

                                    {!following.includes(user._id) &&
                                        <button className="post__button post__button--green"
                                            onClick={() => follow(user._id)}>
                                            Seguir
                                        </button>
                                    }

                                    {following.includes(user._id) &&
                                        <button className="post__button"
                                            onClick={() => unfollow(user._id)}>
                                            dejar de Seguir
                                        </button>
                                    }
                                </div>
                            }

                        </article>
                    )
                })}
            </div >

            {loading ? <div>Cargando...</div> : ''
            }

            {
                more &&
                <div className="content__container-btn">
                    <button className="content__btn-more-post" onClick={nextPage}>
                        Ver mas personas
                    </button>
                </div>
            }

        </>
    )
}

export default UserList
