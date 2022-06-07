import React from 'react';

const styles = require('./widgets.module.scss');

const Cover = () => {
  return (
    <div className={styles.content}>
      <div className={styles.tableFrame}>
        <table>
          <thead>
            <tr>
              <th>Cover</th>
              <th>Effect</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Half cover</td>
              <td>+2 bonus to AC and Dexterity saving throws</td>
            </tr>
            <tr>
              <td>Three-quarters cover</td>
              <td>+5 bonus to AC and Dexterity saving throws</td>
            </tr>
            <tr>
              <td>Total cover</td>
              <td>
                Can't be targeted <em>directly</em> by an attack or spell
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Cover;
