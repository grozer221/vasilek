import React from 'react';
import Search from "antd/es/input/Search";
import s from './Users.module.css'

export const SearchForm: React.FC = () => {
    const onSearch = (value: string) => console.log(value);
    return (
        <div className={s.search}>
            <Search placeholder="Search" onSearch={onSearch} allowClear/>
        </div>
    );
}