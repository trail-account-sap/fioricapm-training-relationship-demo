const cds = require('@sap/cds');
//const { UPDATE } = require('@sap/cds/lib/ql/cds-ql');
const { SalesOrderHeader, SalesOrderItems } = cds.entities;
module.exports = srv => {
    srv.before(['CREATE', 'UPDATE'], 'SalesOrderHeaderSet', (req) => {
        const inData = req.data;
        if (!inData.description || inData.description.trim() === "") {
            req.reject(400, 'The property description is mandatory');
        }
        const items = req.data.items_details_comp || [];
        for (const item of items) {
            if (!item.product || !item.product?.trim()) {
                req.error(400, 'Product is a mandatory property');
            }
            if (!Number.isInteger(item.quantity) || !item.quantity > 0) {
                req.error(400, 'Quantity is a mandatory field and it must be a positive integer');
            }
        }
    });

    srv.on('CREATE', 'SalesOrderHeaderSet', (req) => {
        const d = req.data;
        d.status = 'New';
        return INSERT.into(SalesOrderHeader).entries(d);
    })

    //Action
    srv.on('approveOrder', async (req) => {
        const {ID} = req.params[0];
        console.log(ID);
        await UPDATE(SalesOrderHeader).set({ status: 'Approved' }).where({ ID });

        return { 'success': true, 'message': 'Sales Order approved' };
    });

    //Function
    srv.on('getOrderTotal', async (req) => {
        const { orderId } = req.data;
        const items = await SELECT.from(SalesOrderItems).where({ header_ID: orderId });

        let total = 0;
        for (const item of items) {
            total += item.quantity * item.price;
        }
        return total
    });
}