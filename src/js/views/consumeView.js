import { elements } from './base';

export const clearConsumesTable = () => {
    elements.tableConsumes.innerHTML = '';
};

const renderConsume = consume => {
    const markup = `
        <tr>
            <td>${consume.type}</td>
            <td>${consume.time}</td>
            <td>${consume.liters}</td>
            <td>Edit | Delete</td>
        </tr>
    `;
    elements.tableConsumes.insertAdjacentHTML('beforeend', markup);
};

export const renderConsumesTable = consumes => {
    consumes.forEach(renderConsume);
};
