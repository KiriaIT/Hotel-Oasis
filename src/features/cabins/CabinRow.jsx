import styled from "styled-components";
import { formatCurrency } from "../../utils/helpers";
import {deleteCabin} from "../../services/apiCabins.js";
import {useMutation, useQueryClient} from "@tanstack/react-query";

const TableRow = styled.div`
    display: grid;
    grid-template-columns: 0.6fr 1.8fr 2.2fr 1fr 1fr 1fr;
    column-gap: 2.4rem;
    align-items: center;
    padding: 1.4rem 2.4rem;

    &:not(:last-child) {
        border-bottom: 1px solid var(--color-grey-100);
    }
`;

const Img = styled.img`
    display: block;
    width: 6.4rem;
    aspect-ratio: 3 / 2;
    object-fit: cover;
    object-position: center;
    transform: scale(1.5) translateX(-7px);
`;

const Cabin = styled.div`
    font-size: 1.6rem;
    font-weight: 600;
    color: var(--color-grey-600);
    font-family: "Sono";
`;

const Price = styled.div`
    font-family: "Sono";
    font-weight: 600;
`;

const Discount = styled.div`
    font-family: "Sono";
    font-weight: 500;
    color: var(--color-green-700);
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
`;



    function CabinRow({cabin}) {
        const {name, maxCapacity, regularPrice, discount, image, id} = cabin;

        const queryClient = useQueryClient();

        const {isLoading: isDeleting, mutate} = useMutation({
            mutationFn: deleteCabin,
            onSuccess: () => {
               toast.success ("Cabin successfully deleted");
                queryClient.invalidateQueries({
                    query: ["cabins"],
                })
            },
            onError: (err) => toast.error(err.message),

        });

        return (
            <TableRow role="row">
                <Img src={image} alt={name}/>
                <Cabin>{name}</Cabin>
                <div>Fits up to {maxCapacity} guests</div>
                <Price>{formatCurrency(regularPrice)}</Price>
                {discount ? <Discount>{formatCurrency(discount)}</Discount> : <span>&mdash;</span>}
                <Actions>
                    <button onClick={() => mutate(id)} disabled={isDeleting}>
                        {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                </Actions>
            </TableRow>
        );
    }


export default CabinRow;