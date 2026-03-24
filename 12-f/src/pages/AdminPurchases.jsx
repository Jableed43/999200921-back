import { useGetPurchasesAdmin } from "../hooks/useGetPurchasesAdmin"

const AdminPurchases = () => {
    const { error, loading, purchases } = useGetPurchasesAdmin()
    
    if(loading) {
        return (
            <div className="admin-page"> Cargando todas las ventas... </div>
        )
    }

    if(error) {
        return (
            <div className="admin-page"> Error: {error} </div>
        )
    }

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>Panel de ventas realizadas</h1>
            </div>

            <table className="admin-table" >
                <thead>
                    <tr>
                        <th> ID compra </th>
                        <th> Usuario </th>
                        <th> Fecha </th>
                        <th> Productos </th>
                        <th> Total </th>
                    </tr>
                </thead>
                <tbody>
                    { purchases.map((purchase) => (
                        <tr key={purchase.id} > 
                            <td> {purchase.id} </td>
                            <td> {purchase.userId ? purchase.userId : "No hay usuario" } </td>
                            <td> { new Date(purchase.purchaseDate).toLocaleDateString() } </td>
                            <td>
                            <ul>
                                {purchase.items?.map((item, idx) => (
                                    <li key={idx} > {item.name ? item.name : "Sin nombre"} (x{item.quantity}) </li>
                                ))}
                            </ul>
                            </td>
                            <td>${purchase.totalAmount}</td>
                        </tr>
                    )) }
                </tbody>
            </table>
        </div>
    )
}

export default AdminPurchases