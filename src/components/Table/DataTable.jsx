import './dataTable.scss';

const DataTable = ({ data }) => {
    return (
        <div className='wrapper'>
            <table className='table'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>ФИО</th>
                        <th>Возраст</th>
                        <th>Пол</th>
                        <th>Номер</th>
                        <th>Адрес</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>John Miles Brown</td>
                        <td>24</td>
                        <td>male</td>
                        <td>+8 998 998 9098</td>
                        <td>Atlanta, Georgia, 20 Main Street</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;
