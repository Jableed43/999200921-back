import React from 'react'
import { useGetUsers } from '../hooks/useGetUsers'
import { useDeleteUser } from '../hooks/useDeleteUser'

function AdminUsers() {
    // Llamado a get de usuarios
    const { error, loading, refetch, users } = useGetUsers()
    // Llamado a borrar usuarios
    const { deleteUser, error: errorDelete, loading: loadingDelete } = useDeleteUser()

    const handleDelete = async (id) => {
        if(window.confirm("¿Estas seguro de que deseas eliminar este usuario?")){
            const result = await deleteUser(id)

            if(result.success){
                refetch()
            } else {
                alert(result.error)
            }
        }
    }

      if (loading)
    return (
      <div className="admin-page">
        
        <p>Cargando usuarios</p>
      </div>
    );
  if (error || errorDelete)
    return (
      <div className="admin-page">
        
        <p className="error-text">Error: {error || errorDelete}</p>
      </div>
    );

  return (
    <div>
        

        <table className="admin-table">
        <thead>
          <tr>
            <th>Nombre Completo</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
            {users.map((u) => (
                <tr key={u._id}>
                    <td> {u.name} {u.lastName} </td>
                    <td> {u.email} </td>
                    <td> <span className={`role-badge role-${u.role}`}> {u.role} </span> </td>
                    <td> <button onClick={() => handleDelete(u._id)} disabled={loadingDelete} > { loadingDelete ? "..." : "Eliminar" } </button> </td>
                </tr>
            ) )}
        </tbody>
      </table>
    </div>
  )
}

export default AdminUsers