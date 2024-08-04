import React from 'react';
import Button from './Button';

const Table = ({ 
  className, 
  data = [], 
  reviewStatus = {}, 
  onDelete, 
  onUpdate, 
  onStartClick, 
  onCloseClick, 
  onViewClick, 
  admin,
  onAddReview
}) => {
  return (
    <div className={className}>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Position</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((item, index) => (
              <tr key={item._id || index}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.position}</td>
                <td className="actions">
                  {onUpdate && (
                    <Button
                      className="update"
                      text="Update"
                      onClick={() => onUpdate(item._id)}
                    />
                  )}
                  {reviewStatus[item._id] && reviewStatus[item._id].length > 0 ? (
                    <>
                      <Button
                        className="close-review"
                        text="Close Review"
                        onClick={() => onCloseClick(reviewStatus[item._id][0]._id)}
                      />
                      <Button
                        className="view-review"
                        text="View Review"
                        onClick={() => onViewClick(item._id)}
                      />
                    </>
                  ) : (
                    admin ?  (
                      <Button
                        className="start-review"
                        text="Start Review"
                        onClick={() => onStartClick(item._id)}
                      />
                    ) :(
                      <Button
                        className="start-review"
                        text=" Add Review"
                        onClick={() => onAddReview(item._id)}
                      />
                    )
                  )}
                  {admin && (
                    <Button
                      className="remove"
                      text="X"
                      onClick={() => onDelete(item._id)}
                    />
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
