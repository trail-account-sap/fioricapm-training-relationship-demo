sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("salesorderheader.controller.View1", {
        onInit() {
        },
        async onApproveOrder() {
            var oTable = this.byId('soTable');
            var oItem = oTable.getSelectedItem();
            if (!oItem) {
                sap.m.MessageToast.show('Select a sales order to proceed :)');
                return;
            }
            const oCtx = oItem.getBindingContext();
            const oAction = this.getView().getModel().bindContext('relsrv.approveOrder(...)', oCtx);
            try {
                await oAction.execute();
                sap.m.MessageToast.show('Sales Order Approved Successfully');
                await this.getView().getModel().refresh();
            } catch (err) {
                sap.m.MessageToast.show(err?.message || 'Error while approving the Sales Order ):');
            }
        },
        async onItemPress(oEvent) {
            var ordId = oEvent.getParameter('listItem').getBindingContext().getObject().ID;
            var oModel = this.getOwnerComponent().getModel();
            var oList = oModel.bindContext(`/SalesOrderHeaderSet(ID='${ordId}')`, null, {
                $expand: 'items_details_comp'
            });
            var oCtx = await oList.requestObject();
            this.getView().setModel(new sap.ui.model.json.JSONModel(oCtx.items_details_comp), 'soItems');
        },
        async onGetOrderTotal() {
            const oTable = this.byId('soTable');
            const oItem = oTable.getSelectedItem();
            if (!oItem) {
                sap.m.MessageToast.show('Select an Order to proceed to the Calculation :)');
                return;
            }
            var oCtx = oItem.getBindingContext();
            const oSordId = oCtx.getProperty("ID");
            var oModel = this.getView().getModel();
            var oFunction = oModel.bindContext(`/getOrderTotal(orderId=${oSordId})`, oCtx);
            try {
                var oResultCtx = await oFunction.requestObject();
                var oTotal = oResultCtx.value; //OData V4 Function Result
                this.byId('txtTotal').setText(`Total : $ ${oTotal.toFixed(2)}`);

            } catch (err) {
                sap.m.MessageToast.show(err?.message || 'Error while calculating the total');
            }
        }
    });
});