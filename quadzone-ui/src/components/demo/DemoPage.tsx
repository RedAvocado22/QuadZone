import { useState, useEffect } from "react";
import API from "../../api/base";
// Layout is provided at the App level; don't import Layout here.

function DemoPage() {
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await API.get("/public/demo-controller");

                setMessage(response.data);
            } catch (e: unknown) {
                const err = e as Error;
                setError(err?.message ?? String(e));
                console.error("Failed to fetch data:", e);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const renderContent = () => {
        if (isLoading) {
            return <p>Loading message from backend...</p>;
        }

        if (error) {
            return <p style={{ color: "red" }}>Error: {error}</p>;
        }

        return (
            <p>
                <strong>{message}</strong>
            </p>
        );
    };

    return (
        <div>
            <h2>React Frontend Demo</h2>
            <p>This component is fetching data from your Spring Boot API.</p>
            <div style={{ border: "1px solid #eee", padding: "16px", marginTop: "10px" }}>
                <h3>Message from API:</h3>
                {renderContent()}
            </div>
        </div>
    );
}

export default DemoPage;
