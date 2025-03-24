"use client";
import styles from "./comments.module.css"
import Image from 'next/image';
import Link from 'next/link';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react'
import { baseUrl } from "@/utils/api";

const fetcher = async (url) => {
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
        const error = new Error(data.message);
        throw error;
    }
    return data;
}

const Comments = ({postSlug}) => {
    const {status, data: sessionData } = useSession()

    const {data, mutate, isLoading} = useSWR(`${baseUrl}/api/comments?postSlug=${postSlug}`, fetcher)
    const [desc, setDesc] = useState("");

    const handleSubmit = async () => {
        await fetch("/api/comments", {
            method: "POST",
            body: JSON.stringify({desc, postSlug})
        });
        mutate();
    }

    const handleDelete = async (commentId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this comment?");
        if (!confirmDelete) return;

        try {
            const res = await fetch("/api/comments", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ commentId }),
            });

            const result = await res.json();
            if (res.ok) {
                mutate(); // Refresh the comment list after deletion
            } else {
                alert(result.message);
            }
        } catch (err) {
            console.error("Failed to delete comment:", err);
            alert("Something went wrong while deleting the comment.");
        }
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}> Comments </h1>
            {status === "authenticated" ? (
                <div className={styles.write}>
                    <textarea
                        placeholder="Write a comment..."
                        className={styles.input}
                        onChange={e => setDesc(e.target.value)}
                    />
                    <button className={styles.button} onClick={handleSubmit}>Send</button>
                </div>
            ) : (
                <Link href="/login">Login to write a comment.</Link>
            )}

<div className={styles.comments}>
            {isLoading
            ? "loading"
        : data?.map((item) =>(
            <div className = {styles.comment} key = {item._id}>
                <div className = {styles.user}>
                   {item?.user?.image && <Image 
                        src = {item.user.image}
                        alt = ""
                        width = {50}
                        height = {50}
                        className = {styles.image}
                        />}
                    <div className= {styles.userInfo}>
                        <span className = {styles.username}> {item.user.name} </span>
                        <span className = {styles.date}>
                            {new Date(item?.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                            })}    
                         </span>
                    </div>
                        </div>
                            <p className={styles.desc}>{item.desc}</p>

                            {/* Delete button - only visible to the author */}
                            {sessionData?.user?.email === item.userEmail && (
                                <button
                                    className={styles.deleteButton}
                                    onClick={() => handleDelete(item.id)}
                                >
                                    Delete Comment
                                </button>
                            )}
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default Comments
