import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function DeleteAlert({
  deleteConfirmation,
  setDeleteConfirmation,
  handleDelete,
}) {
  return (
    <AlertDialog open={deleteConfirmation} onOpenChange={setDeleteConfirmation}>
      <AlertDialogContent className="w-[500px] max-w-[90vw] rounded-md bg-[#0C0A09] border-none">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Do you want to delete this note?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="bg-secondary text-secondary-foreground hover:bg-neutral-300 h-fit text-xs"
            onClick={() => setDeleteConfirmation(false)}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              handleDelete();
            }}
            className="bg-destructive text-destructive-foreground hover:bg-red-600 text-xs h-fit"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteAlert;
