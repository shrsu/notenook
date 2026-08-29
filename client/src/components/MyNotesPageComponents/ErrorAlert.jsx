import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function ErrorAlert({ error, showError, setError, setShowError }) {
  return (
    <AlertDialog open={showError} onOpenChange={setShowError}>
      <AlertDialogContent className="w-[500px] max-w-[90vw] rounded-md bg-[#0C0A09] border-none">
        <AlertDialogHeader>
          <AlertDialogTitle>Error</AlertDialogTitle>
          <AlertDialogDescription>{error}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={() => {
              setShowError(false);
              setError(null);
            }}
            className="bg-primary text-primary-foreground hover:bg-primary-hover text-xs h-fit"
          >
            OK
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ErrorAlert;
