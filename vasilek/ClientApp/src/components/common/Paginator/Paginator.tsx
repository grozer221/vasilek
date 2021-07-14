import React, {useState} from 'react';
import s from './Paginator.module.css';
import arrowLeft from '../../../assets/images/arrow-parinator-left.png';
import arrowRight from '../../../assets/images/arrow-parinator-right.png';

type PropsType = {
    itemsCount: number
    pageSize: number
    currentPage: number
    onPageChanged: (pageNumber: number) => void
    portionSize?: number
}

let Paginator: React.FC<PropsType> = ({itemsCount, pageSize, currentPage, onPageChanged, portionSize = 5}) => {

    let pagesCount = Math.ceil(itemsCount / pageSize);

    let pages: Array<number> = [];
    for (let i = 1; i <= pagesCount; i++) {
        pages.push(i);
    }

    let portionCount = Math.ceil(pagesCount / portionSize);
    let [portionNumber, setPortionNumber] = useState(1);
    let leftPortionPageNumber = (portionNumber - 1) * portionSize + 1;
    let rightPortionNumber = portionNumber * portionSize;


    return (
        <div className={s.wrapper_pagination}>
            {portionNumber > 1 &&
            <div className={s.pagination} onClick={() => {
                setPortionNumber(portionNumber - 1)
            }}><img src={arrowLeft}/></div>}
            {pages
                .filter(p => p >= leftPortionPageNumber && p <= rightPortionNumber)
                .map(p => {
                    return <div key={p} className={`${currentPage === p && s.selectedPage} ${s.pagination}`}
                                onClick={() => {
                                    onPageChanged(p);
                                }}>{p}</div>;
                })}
            {portionCount > portionNumber &&
            <div className={s.pagination} onClick={() => {
                setPortionNumber(portionNumber + 1)
            }}><img src={arrowRight}/></div>}
        </div>
    );
};

export default Paginator;