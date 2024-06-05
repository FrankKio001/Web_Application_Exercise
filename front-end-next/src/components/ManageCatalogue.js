import { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MyAppContext } from '../pages/_app';

const ManageCatalogue = () => {
    const [projects, setProjects] = useState([]);
    const { jwtToken } = useContext(MyAppContext);
    const router = useRouter();

    useEffect( () => {
        if (jwtToken === "") {
            router.push("/login");
            return
        }
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + jwtToken);

        const requestOptions = {
            method: "GET",
            headers: headers,
        }

        fetch(`${process.env.NEXT_PUBLIC_BACKEND}/admin/projects`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setProjects(data);
            })
            .catch(err => {
                console.log(err);
            })

    }, [jwtToken, router]);

    return(
        <div>
            <h2>Manage Catalogue</h2>
            <hr />
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>Project</th>
                        <th>Status</th>
                        <th>LastUpdated</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map((m) => (
                        <tr key={m.id}>
                            <td>
                                <Link href={`/admin/project/${m.id}`}>
                                    {m.title}
                                </Link>
                            </td>
                            <td>{m.status}</td>
                            <td>{m.updated_at}</td>
                        </tr>    
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ManageCatalogue;