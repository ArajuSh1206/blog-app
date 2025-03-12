"use client";
import React, { useState, useEffect, useRef } from 'react';
import styles from "./writePage.module.css";
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "@/utils/firebase";

const WritePage = () => {
    const { status } = useSession();
    const router = useRouter();
    const [file, setFile] = useState(null);
    const [media, setMedia] = useState("");
    const [open, setOpen] = useState(false);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [catSlug, setCatSlug] = useState("");
    const editorRef = useRef(null);
    const quillRef = useRef(null);

    // Handle file upload to Firebase
    useEffect(() => {
        if (typeof window === 'undefined' || !file) return;

        const storage = getStorage(app);
        
        const upload = () => {
            const name = new Date().getTime() + file.name;
            const storageRef = ref(storage, name);

            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log("Upload is " + progress + "% done");
                },
                (error) => {
                    console.error("Upload error:", error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setMedia(downloadURL);
                        
                        // Insert the image into the Quill editor if it exists
                        if (quillRef.current) {
                            const range = quillRef.current.getSelection(true);
                            quillRef.current.insertEmbed(range.index, 'image', downloadURL);
                            quillRef.current.setSelection(range.index + 1);
                        }
                    });
                }
            );
        };

        upload();
    }, [file]);

    // Initialize Quill on the client side
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Dynamically import Quill
            import('quill').then(({ default: Quill }) => {
                if (!quillRef.current && editorRef.current) {
                    quillRef.current = new Quill(editorRef.current, {
                        theme: 'snow',
                        placeholder: 'Tell your story...',
                        modules: {
                            toolbar: [
                                ['bold', 'italic', 'underline', 'strike'],
                                ['blockquote', 'code-block'],
                                [{ 'header': 1 }, { 'header': 2 }],
                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                [{ 'script': 'sub' }, { 'script': 'super' }],
                                [{ 'indent': '-1' }, { 'indent': '+1' }],
                                [{ 'direction': 'rtl' }],
                                [{ 'size': ['small', false, 'large', 'huge'] }],
                                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                                [{ 'color': [] }, { 'background': [] }],
                                [{ 'font': [] }],
                                [{ 'align': [] }],
                                ['clean'],
                                ['link', 'image', 'video']
                            ]
                        }
                    });

                    // Custom handler for image upload via toolbar
                    const toolbar = quillRef.current.getModule('toolbar');
                    toolbar.addHandler('image', () => {
                        const input = document.createElement('input');
                        input.setAttribute('type', 'file');
                        input.setAttribute('accept', 'image/*');
                        input.click();

                        input.onchange = () => {
                            if (input.files && input.files[0]) {
                                setFile(input.files[0]);
                            }
                        };
                    });

                    // Set up content change handler
                    quillRef.current.on('text-change', () => {
                        setContent(quillRef.current.root.innerHTML);
                    });
                }
            });
        }

        // Cleanup
        return () => {
            quillRef.current = null;
        };
    }, []);

    if (status === "loading") {
        return <div className={styles.loading}>loading...</div>
    }
    
    if (status === "unauthenticated") {
        router.push("/")
    }

    const slugify = (str) =>
        str
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/[\s_-]+/g, "-")
            .replace(/^-+|-+$/g, "");

    const handleSubmit = async () => {
        if (!title) {
            alert("Please add a title");
            return;
        }

        const res = await fetch("/api/posts", {
            method: "POST",
            body: JSON.stringify({
                title,
                desc: content,
                img: media,
                slug: slugify(title),
                catSlug: catSlug || "style", // If not selected, choose the general category
            }),
        });

        if (res.status === 200) {
            const data = await res.json();
            router.push(`/posts/${data.slug}`);
        } else {
            alert("Something went wrong!");
        }
    };
    
    return (
        <div className={styles.container}>
            <input 
                type="text" 
                placeholder="Title" 
                className={styles.input} 
                onChange={(e) => setTitle(e.target.value)}
            />
            
            <select 
                className={styles.select} 
                onChange={(e) => setCatSlug(e.target.value)}
            >
                <option value="style">style</option>
                <option value="fashion">fashion</option>
                <option value="food">food</option>
                <option value="culture">culture</option>
                <option value="travel">travel</option>
                <option value="coding">coding</option>
            </select>
            
            <div className={styles.editor}>                
                {/* We need to include Quill CSS */}
                <link 
                    href="https://cdn.quilljs.com/1.3.6/quill.snow.css" 
                    rel="stylesheet" 
                />
                
                {/* Editor container */}
                <div className={styles.quillContainer}>
                    <div ref={editorRef} className={styles.textArea}></div>
                </div>
            </div>
            
            <button 
                className={styles.publish}
                onClick={handleSubmit}
            >
                Publish
            </button>
        </div>
    )
}

export default WritePage;