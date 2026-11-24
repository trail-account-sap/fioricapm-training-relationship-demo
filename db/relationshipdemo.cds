namespace relationshipdemo.db;

entity Header {
    key ID           : UUID;
        description  : String;
        item_details : Association to many Items
                           on item_details.headerID = $self.ID;
}

entity Items {
    key ID       : UUID;
        headerID : UUID;
        product  : String;
        quantity : Integer;
}

entity SalesOrderHeader {
    key ID                 : UUID;
        description        : String;
        items_details_comp : Composition of many SalesOrderItems
                                 on items_details_comp.header = $self;
        status             : statusTxt;
}

type statusTxt : String enum {
    New = 'NEW';
    Inprocess = 'INPRC';
    Completed = 'COMP'
}

entity SalesOrderItems {
    key ID       : UUID;
        header   : Association to SalesOrderHeader;
        product  : String;
        quantity : Integer;
        price    : Decimal(10, 4);
}
