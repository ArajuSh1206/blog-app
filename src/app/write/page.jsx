"use client";
import React, { useState, useEffect, useRef } from 'react';
import styles from "./writePage.module.css";
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const WritePage = () => {
    const { status } = useSession();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [content, setContent] = useState("");
    const editorRef = useRef(null);
    const quillRef = useRef(null);

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
    
    return (
        <div className={styles.container}>
            <input type="text" placeholder="Title" className={styles.input} />
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
                onClick={() => {
                    console.log('Content to publish:', content);
                    // You would normally send this to your API
                }}
            >
                Publish
            </button>
        </div>
    )
}

export default WritePage;