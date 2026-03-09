import React, { useState } from "react";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import Button  from "../ui/Button.jsx";
import CabinTable from "../features/cabins/CabinTable";
import CreateCabinForm from "../features/cabins/CreateCabinForm.jsx";

function Cabins() {
    const [showForm, setShowForm] = useState(false);

    return (
        <>
            <Row type="horizontal">
                <Heading as="h1">All cabins</Heading>
                <p>Filter / Sort</p>
            </Row>

            <CabinTable />

            <Row>
                <Button onClick={() => setShowForm((show) => !show)}>
                    Add new cabin
                </Button>
                {showForm && <CreateCabinForm key={showForm} />}
            </Row>

        </>
    );
}

export default Cabins;