function DeleteElement(ElementId)
{
    var el = document.getElementById(ElementId);

    var child = el.lastElementChild;
    while(child)
    {
        el.removeChild(child);
        child = el.lastElementChild;
    }
    el.remove();

}

function DeleteChildren(ElementId)
{
    var el = document.getElementById(ElementId);

    var child = el.lastElementChild;
    while(child)
    {
        el.removeChild(child);
        child = el.lastElementChild;
    }
}