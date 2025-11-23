import { Text, Button, CloseButton, Dialog, Field, Input, Portal, VStack, NativeSelect } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { listingParserBaseSchema, parserMethods, type listingParserCreate } from "@/schemas/listingParserSchema";
import { useCreateListingParser, useUpdateListingParser, type ListingParser, type ListingParserBase } from "@/services/api/listing_parser";
import DOMPurify from "dompurify";
import { conditionMap, containerTypes, listingTypes } from "@/schemas/listingSchema";
import { useEffect, useMemo, useState } from "react";

interface ListingParserDlgProps {
    isOpen: boolean;
    onClose: () => void;
    isEdit?: boolean;
    listingParser?: ListingParser | null;
}

export const ListingParserDlg = ({ isOpen, onClose, isEdit = false, listingParser }: ListingParserDlgProps) => {
    const createListingParser = useCreateListingParser();
    const updateListingParser = useUpdateListingParser();
    const [error, setError] = useState<string | null>(null);

    const defaultValues = useMemo(() => ({
        company_name: listingParser?.company_name ?? "",
        method: listingParser?.method ?? Object.keys(parserMethods)[0] ?? "",
        url: listingParser?.url ?? "",
        location: listingParser?.location ?? "",
        condition: listingParser?.condition ?? Object.keys(conditionMap)[0] ?? "",
        type: listingParser?.type ?? Object.keys(listingTypes)[0] ?? "",
        currency: listingParser?.currency ?? Intl.supportedValuesOf("currency")[0],
        container_type: listingParser?.container_type ?? Object.keys(containerTypes)[0],
    }), [listingParser]);

    const { handleSubmit, register, formState: { errors, isSubmitting }, reset } = useForm<listingParserCreate>({
        resolver: zodResolver(listingParserBaseSchema),
        defaultValues,
    });

    useEffect(() => {
        reset(defaultValues);
    }, [defaultValues, reset, isOpen]);

    const sanitizeAll = (data: Record<string, unknown>) =>
        Object.fromEntries(
            Object.entries(data).map(([key, value]) => [
                key,
                typeof value === "string" ? DOMPurify.sanitize(value) : value,
            ])
        );

    const onSubmit = async (data: listingParserCreate) => {
        try {
            setError(null);
            const sanitizedData = sanitizeAll(data);
            const formData: ListingParserBase = sanitizedData as unknown as ListingParserBase;

            if (isEdit) {
                if (!listingParser?.id) {
                    setError("Missing parser to update");
                    return;
                }
                await updateListingParser.mutateAsync({ parserId: listingParser.id, formData });
            } else {
                await createListingParser.mutateAsync(formData);
            }

            onClose();
        } catch (error) {
            setError("There is an error");
            console.error("Registration error:", error);
        }
    };

    return (
        <Dialog.Root lazyMount open={isOpen}>
            <Dialog.Trigger asChild>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Dialog.Header>
                                <Dialog.Title>
                                    {isEdit ? "Edit listing parser" : "Create listing parser"}
                                </Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body>
                                <VStack gap="4">
                                    <Field.Root required>
                                        <Field.Label>
                                            Company name <Field.RequiredIndicator />
                                        </Field.Label>
                                        <Input
                                            {...register("company_name")}
                                            placeholder="Company name"
                                        />
                                        {errors.company_name && <Text role="alert" color="red.500">{errors.company_name.message}</Text>}
                                    </Field.Root>
                                    <Field.Root required>
                                        <Field.Label>
                                            Method <Field.RequiredIndicator />
                                        </Field.Label>
                                        <NativeSelect.Root>
                                            <NativeSelect.Field
                                                {...register("method")}
                                            >
                                                {Object.entries(parserMethods).map(([key, label]) => (
                                                    <option key={key} value={key}>{label}</option>
                                                ))}
                                            </NativeSelect.Field>
                                            <NativeSelect.Indicator />
                                        </NativeSelect.Root>

                                        {errors.method && <Text role="alert" color="red.500">{errors.method.message}</Text>}
                                    </Field.Root>

                                    <Field.Root required>
                                        <Field.Label>
                                            URL <Field.RequiredIndicator />
                                        </Field.Label>
                                        <Input
                                            {...register("url")}
                                            placeholder="URL"
                                        />
                                        {errors.url && <Text role="alert" color="red.500">{errors.url.message}</Text>}
                                    </Field.Root>

                                    <Field.Root required>
                                        <Field.Label>
                                            Location <Field.RequiredIndicator />
                                        </Field.Label>
                                        <Input
                                            {...register("location")}
                                            placeholder="City, country"
                                        />
                                        {errors.location && <Text role="alert" color="red.500">{errors.location.message}</Text>}
                                    </Field.Root>

                                    <Field.Root required>
                                        <Field.Label>
                                            Condition <Field.RequiredIndicator />
                                        </Field.Label>
                                        <NativeSelect.Root>
                                            <NativeSelect.Field
                                                {...register("condition")}
                                            >
                                                {Object.entries(conditionMap).map(([key, label]) => (
                                                    <option key={key} value={key}>{label}</option>
                                                ))}
                                            </NativeSelect.Field>
                                            <NativeSelect.Indicator />
                                        </NativeSelect.Root>

                                        {errors.condition && <Text role="alert" color="red.500">{errors.condition.message}</Text>}
                                    </Field.Root>

                                    <Field.Root>
                                        <Field.Label>
                                            Listing type
                                        </Field.Label>
                                        <NativeSelect.Root>
                                            <NativeSelect.Field
                                                {...register("type")}
                                            >
                                                {Object.entries(listingTypes).map(([key, label]) => (
                                                    <option key={key} value={key}>{label}</option>
                                                ))}
                                            </NativeSelect.Field>
                                            <NativeSelect.Indicator />
                                        </NativeSelect.Root>

                                        {errors.type && <Text role="alert" color="red.500">{errors.type.message}</Text>}
                                    </Field.Root>

                                    <Field.Root>
                                        <Field.Label>
                                            Currency
                                        </Field.Label>
                                        <NativeSelect.Root>
                                            <NativeSelect.Field
                                                {...register("currency")}
                                            >
                                                {Intl.supportedValuesOf("currency").map((key) => (
                                                    <option key={key} value={key}>{key}</option>
                                                ))}
                                            </NativeSelect.Field>
                                            <NativeSelect.Indicator />
                                        </NativeSelect.Root>

                                        {errors.type && <Text role="alert" color="red.500">{errors.type.message}</Text>}
                                    </Field.Root>
                                    <Field.Root>
                                        <Field.Label>
                                            Container type
                                        </Field.Label>
                                        <NativeSelect.Root>
                                            <NativeSelect.Field
                                                {...register("container_type")}
                                            >
                                                {Object.entries(containerTypes).map(([key, label]) => (
                                                    <option key={key} value={key}>{label}</option>
                                                ))}
                                            </NativeSelect.Field>
                                            <NativeSelect.Indicator />
                                        </NativeSelect.Root>

                                        {errors.type && <Text role="alert" color="red.500">{errors.type.message}</Text>}
                                    </Field.Root>

                                    {error && (
                                        <Text>There is some error: {error}</Text>
                                    )}

                                </VStack>
                            </Dialog.Body>
                            <Dialog.Footer>
                                <Dialog.ActionTrigger asChild>
                                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                                </Dialog.ActionTrigger>
                                <Button type="submit">
                                    {isSubmitting ? "Processing..." : isEdit ? "Update parser" : "Create parser"}
                                </Button>
                            </Dialog.Footer>
                            <Dialog.CloseTrigger asChild>
                                <CloseButton size="sm" />
                            </Dialog.CloseTrigger>
                        </form>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};
