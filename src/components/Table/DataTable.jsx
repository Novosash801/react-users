import { useEffect, useState } from 'react';
import './dataTable.scss';
import apiData from '../../api/apiData';

const DataTable = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sortedInfo, setSortedInfo] = useState({});
    const [searchData, setSearchData] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredData, setFilteredData] = useState([]);
    const [columns, setColumns] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await apiData();
            setLoading(false);

            if (res.error) {
                // Обработка ошибки
                console.error(`Ошибка: ${res.error}`);
                return;
            }

            const modUsers = res.users.map((item) => ({
                ...item,
                key: item.id,
                name: `${item.firstName} ${item.maidenName || ''} ${item.lastName}`,
                address: `${item.address.city}, ${item.address.address}`,
            }));
            setUsers(modUsers);
            setFilteredData(modUsers);
        } catch (error) {
            setLoading(false);
            console.error('Ошибка при обработке данных:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const getSortIcon = (columnKey) => {
            if (sortedInfo.columnKey === columnKey) {
                if (sortedInfo.order === 'ascend') return ' (по возрастанию)';
                if (sortedInfo.order === 'descend') return ' (по убыванию)';
            }
            return '';
        };

        setColumns([
            {
                title: <span>ID {getSortIcon('id')}</span>,
                dataIndex: 'id',
                sorter: true,
                width: 50,
            },
            {
                title: <span>ФИО {getSortIcon('name')}</span>,
                dataIndex: 'name',
                sorter: true,
                width: 200,
                ellipsis: true,
            },
            {
                title: <span>Возраст {getSortIcon('age')}</span>,
                dataIndex: 'age',
                sorter: true,
                width: 100,
            },
            {
                title: <span>Пол{getSortIcon('gender')}</span>,
                dataIndex: 'gender',
                sorter: true,
                width: 100,
            },
            {
                title: <span>Номер{getSortIcon('phone')}</span>,
                dataIndex: 'phone',
                width: 150,
                ellipsis: true,
            },
            {
                title: <span>Адрес{getSortIcon('address')}</span>,
                dataIndex: 'address',
                sorter: true,
                width: 250,
                ellipsis: true,
            },
        ]);
    }, [sortedInfo]);

    const getNextSortOrder = (columnKey) => {
        if (sortedInfo.columnKey !== columnKey) return 'ascend';
        switch (sortedInfo.order) {
            case 'ascend':
                return 'descend';
            case 'descend':
                return '';
            default:
                return 'ascend';
        }
    };

    const handleChange = (columnKey) => {
        const nextOrder = getNextSortOrder(columnKey);
        setSortedInfo({ columnKey, order: nextOrder });
        sortData(columnKey, nextOrder);
    };

    const sortData = (field, order) => {
        if (!order) {
            setFilteredData(users);
            return;
        }

        const sorted = [...filteredData].sort((a, b) => {
            if (order === 'ascend') {
                return a[field] > b[field] ? 1 : -1;
            } else if (order === 'descend') {
                return a[field] < b[field] ? 1 : -1;
            }
            return 0;
        });
        setFilteredData(sorted);
    };

    const clearAll = () => {
        setSortedInfo({});
        setSearchData('');
        setFilteredData(users);
    };

    const handleSearch = async (e) => {
        setSearchData(e.target.value);
        if (e.target.value === '') {
            setFilteredData(users);
            return;
        }
        await globalSearch(e.target.value);
    };

    const globalSearch = async (query) => {
        try {
            setLoading(true);
            const response = await fetch(`https://dummyjson.com/users/search?q=${query}`);
            const result = await response.json();
            setLoading(false);

            if (result.error) {
                console.error(`Ошибка: ${result.error}`);
                return;
            }

            const modUsers = result.users.map((item) => ({
                ...item,
                key: item.id,
                name: `${item.firstName} ${item.maidenName || ''} ${item.lastName}`,
                address: `${item.address.city}, ${item.address.address}`,
            }));
            setFilteredData(modUsers);
        } catch (error) {
            setLoading(false);
            console.error('Ошибка при обработке данных:', error);
        }
    };

    const showModal = (record) => {
        setSelectedUser(record);
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <div className='user-table-container'>
            <div className='search-bar'>
                <input
                    placeholder='Введите данные...'
                    onChange={handleSearch}
                    type='text'
                    value={searchData}
                    className='search-input'
                />
                <button onClick={clearAll} className='clear-button'>
                    Сброс
                </button>
            </div>
            <table className='user-table'>
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th key={col.dataIndex} onClick={() => handleChange(col.dataIndex)}>
                                {typeof col.title === 'function' ? col.title() : col.title}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((user) => (
                        <tr key={user.id} onClick={() => showModal(user)}>
                            {columns.map((col) => (
                                <td key={col.dataIndex}>{user[col.dataIndex]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            {isModalOpen && selectedUser && (
                <div className='modal-overlay'>
                    <div className='modal'>
                        <h2>Подробная информация о пользователе</h2>
                        <div>
                            <p>
                                <strong>ФИО:</strong> {selectedUser.name}
                            </p>
                            <p>
                                <strong>Возраст:</strong> {selectedUser.age}
                            </p>
                            <p>
                                <strong>Адрес:</strong> {selectedUser.address}
                            </p>
                            <p>
                                <strong>Рост:</strong> {selectedUser.height} см
                            </p>
                            <p>
                                <strong>Вес:</strong> {selectedUser.weight} кг
                            </p>
                            <p>
                                <strong>Номер телефона:</strong> {selectedUser.phone}
                            </p>
                            <p>
                                <strong>Email:</strong> {selectedUser.email}
                            </p>
                        </div>
                        <button onClick={handleOk} className='modal-close-button'>
                            Закрыть
                        </button>
                    </div>
                </div>
            )}
            {loading && <div className='loading'>Загрузка...</div>}
        </div>
    );
};

export default DataTable;
