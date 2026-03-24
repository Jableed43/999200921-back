import { useState } from "react"
import { useCreateCategory } from "../hooks/useCreateCategory"
import { useDeleteCategory } from "../hooks/useDeleteCategory"
import { useGetCategories } from "../hooks/useGetCategories"

const AdminCategories = () => {
    const {categories, error, loading, refetch} = useGetCategories()
    const { deleteCategory, error: deleteCategoryError, loading: deleteCategoryLoading } = useDeleteCategory()
    const { createCategory, error: errorCreateCategory, loading: loadingCreateCategory } = useCreateCategory()
    const [newName, setNewName] = useState("")

    const handleCreate = async(e) => {
        // No olvidarse del preventDefault
        // Si no lo colocas, el form va a refrescar la pagina y no se manda la data
        e.preventDefault()
        if(!newName.trim()){
            return null
        }
        const result = await createCategory(newName)
        if(result.success){
            setNewName("")
            refetch()
        } else {
            alert(result.error)
        }

    }

    const handleDelete = async (id) => {
        if(window.confirm("¿Eliminar esta categoria?")){
           const result = await deleteCategory(id)
           if(result.success){
            refetch()
           } else {
            alert(result.error)
           }
        }
    }

    if(loading){
        return ( <div className="admin-page" > Cargando categorias... </div> )
    }

    if (error || deleteCategoryError || errorCreateCategory) {
    // Filtramos solo los que tienen contenido (no son null/undefined)
    const activeErrors = [error, deleteCategoryError, errorCreateCategory].filter(Boolean);

    return (
        <div className="admin-page error-container">
            <h3>Ha ocurrido un problema:</h3>
            <ul>
                {activeErrors.map((err, index) => (
                    <li key={index}>{err}</li>
                ))}
            </ul>
        </div>
    );
}

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>Gestion de categorias</h1>
            </div>

            <form onSubmit={handleCreate} className="category-form" >
                <input type="text"
                placeholder="Nombre de nueva categoría"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                />
                <button className="btn-add" type="submit" disabled={loadingCreateCategory}>{loadingCreateCategory ? "..." : "+ Agregar"}</button>
            </form>

            <table className="admin-table" >
                <thead>
                    <tr>
                        <th> Nombre </th>
                        <th> Acciones </th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category) => (
                    <tr key={category._id} > 
                    <td>{category.name}</td>
                    <td>
                        <button onClick={() => handleDelete(category._id)} disabled={deleteCategoryLoading} className="btn-delete">Eliminar</button>
                    </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default AdminCategories