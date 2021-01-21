import {useMemo} from 'react'
import {Pagination} from 'react-bootstrap'

function CustomPagination({current = 1, total = 0, limit = 4, onChangePage}) {
    const maxPage = useMemo(() => {
        return Math.ceil(total/limit)
    },[total, limit])
    
    const onClickPage = (page) => {
        if(page === current) return
        onChangePage(page)
    }

    const renderItems = () => {
        let items = []
        for (let number = 1; number <= maxPage; number++) {
            items.push(
                <Pagination.Item 
                    style={{ cursor:'pointer' }}
                    key={number} 
                    active={number === current}
                    onClick={() => onClickPage(number)}
                >

                {number}
              </Pagination.Item>,
            );
        }
        return items
    }

    return (
        <Pagination className="d-flex justify-content-center mt-3">
            {renderItems()}
        </Pagination>
    )
}

export default CustomPagination

